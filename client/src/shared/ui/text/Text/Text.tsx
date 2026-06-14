import { Typography, type SxProps, type Theme, type TypographyProps } from "@mui/material";

type TDefaultTextProps = TypographyProps & {
	children: React.ReactNode;
};

const Text = ({ children, variant = "body1", sx, ...props }: TDefaultTextProps) => {
	const styles: SxProps<Theme> = {
		...sx,
		color: "#525252",
	};

	return (
		<Typography variant={variant} {...props} sx={styles}>
			{children}
		</Typography>
	);
};

export default Text;
