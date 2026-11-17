import { ScreenLayout } from "../../../shared/components/ScreenLayout/ScreenLayout";

interface PlaceholderScreenProps {
    title: string;
}

export function PlaceholderScreen({
    title,
}: PlaceholderScreenProps) {
    return (
        <ScreenLayout
            title={title}
            description="This screen will be implemented soon."
        >
            <p>{title}</p>
        </ScreenLayout>
    );
}