import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ButtonWithIcon } from "./ButtonWithIcon";

export interface IButtonAddProps {
	text: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ButtonAdd = ({ text, onClick }: IButtonAddProps) => {
	const { t } = useTranslation();

	return <ButtonWithIcon text={t(text)} Icon={Plus} onClick={onClick} variant="outline" />;
};
