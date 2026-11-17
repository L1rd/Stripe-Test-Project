import { useState } from "react";

import styled from "styled-components";
import { z } from "zod";

import {
    getCountries,
    getCountryCallingCode,
    parsePhoneNumberFromString,
    type CountryCode,
} from "libphonenumber-js";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";

import {
    selectPhoneCountry,
    selectPhoneInput,
} from "../../onboardingSelectors";

import {
    setPhone,
    setPhoneCountry,
    setPhoneInput,
} from "../../onboardingSlice";

import { useFlowNavigation } from "../../hooks/useFlowNavigation";

import { ScreenLayout } from "@/shared/components/ScreenLayout/ScreenLayout";
import { Button } from "@/shared/components/Button/Button";
import { Input } from "@/shared/components/Input/Input";

import { ErrorText, Form } from "@/shared/components/ScreenLayout/ScreenLayout.styles";

const countries = getCountries().sort((a, b) =>
    a.localeCompare(b),
);

const CountrySelect = styled.select`
  min-height: 52px;
  padding: 0 10px;

  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};

  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};

  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const PhoneInputGroup = styled.div`
  display: grid;
  grid-template-columns: minmax(105px, 0.8fr) minmax(0, 2fr);
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FieldLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  font-size: 14px;
  font-weight: 600;
`;

function getPhoneSchema(country: CountryCode) {
    return z
        .string()
        .min(1, "Введіть номер телефону")
        .refine(
            (value) => {
                const phoneNumber = parsePhoneNumberFromString(
                    value,
                    country,
                );

                return phoneNumber?.isValid() ?? false;
            },
            {
                message: "Введіть коректний номер телефону",
            },
        );
}

export function PhoneScreen() {
    const dispatch = useAppDispatch();

    const phoneInput = useAppSelector(selectPhoneInput);
    const savedCountry = useAppSelector(selectPhoneCountry);

    const [hasEdited, setHasEdited] = useState(false);

    const { goToNextStep } = useFlowNavigation();

    const country: CountryCode = countries.includes(
        savedCountry as CountryCode,
    )
        ? (savedCountry as CountryCode)
        : "UA";

    const phoneSchema = getPhoneSchema(country);

    const validation = phoneSchema.safeParse(phoneInput);

    const phoneNumber =
        typeof phoneInput === "string" && phoneInput.trim() !== ""
            ? parsePhoneNumberFromString(phoneInput, country)
            : undefined;

    const error = hasEdited && !validation.success
        ? validation.error.issues[0]?.message
        : undefined;

    const handlePhoneChange = (value: string) => {
        setHasEdited(true);

        dispatch(setPhoneInput(value));

        const parsedPhone = parsePhoneNumberFromString(
            value,
            country,
        );

        if (parsedPhone?.isValid()) {
            dispatch(setPhone(parsedPhone.number));
        } else {
            dispatch(setPhone(""));
        }
    };

    const handleCountryChange = (value: string) => {
        const nextCountry = value as CountryCode;

        dispatch(setPhoneCountry(nextCountry));

        const parsedPhone = parsePhoneNumberFromString(
            phoneInput,
            nextCountry,
        );

        dispatch(
            setPhone(
                parsedPhone?.isValid() ? parsedPhone.number : "",
            ),
        );
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validation.success || !phoneNumber?.isValid()) {
            setHasEdited(true);
            return;
        }

        dispatch(setPhone(phoneNumber.number));

        goToNextStep();
    };

    return (
        <ScreenLayout
            title="What's your phone number?"
            description="Enter your phone number to continue."
        >
            <Form onSubmit={handleSubmit}>
                <div>
                    <FieldLabel htmlFor="phone">Phone number</FieldLabel>

                    <PhoneInputGroup>
                        <CountrySelect
                            aria-label="Country code"
                            value={country}
                            onChange={(event) =>
                                handleCountryChange(event.target.value)
                            }
                        >
                            {countries.map((countryCode) => (
                                <option key={countryCode} value={countryCode}>
                                    {countryCode} (+{getCountryCallingCode(countryCode)})
                                </option>
                            ))}
                        </CountrySelect>

                        <Input
                            id="phone"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel-national"
                            placeholder="501234567"
                            value={phoneInput}
                            onChange={(event) =>
                                handlePhoneChange(event.target.value)
                            }
                        />
                    </PhoneInputGroup>
                </div>

                {error && <ErrorText>{error}</ErrorText>}

                <Button
                    type="submit"
                    fullWidth
                    disabled={!validation.success || !phoneNumber?.isValid()}
                >
                    Continue
                </Button>
            </Form>
        </ScreenLayout>
    );
}