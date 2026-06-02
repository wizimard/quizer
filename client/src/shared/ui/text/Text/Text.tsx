import { Typography, type TypographyProps } from "@mui/material";

type TDefaultTextProps = TypographyProps & {
	children: React.ReactNode;
};

const Text = ({ children, variant = "body1", ...props }: TDefaultTextProps) => {
	return (
		<Typography variant={variant} {...props}>
			{children}
		</Typography>
	);
};

export default Text;
