import { Button, type ButtonProps } from "@mui/material";

export type TDefaultButtonProps = ButtonProps & {
	children: React.ReactNode;
	isLoading?: boolean;
};

const DefaultButton = ({ children, type = "button", isLoading, variant = "contained", ...props }: TDefaultButtonProps) => {
	return (
		<Button variant={variant} type={type} loading={isLoading} {...props}>
			{children}
		</Button>
	);
};

export default DefaultButton;
