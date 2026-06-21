import { Typography, type SxProps, type Theme, type TypographyProps } from "@mui/material";

type TDefaultTextProps = TypographyProps & {
	children: React.ReactNode;
};

const Text = ({ children, variant = "body1", sx, ...props }: TDefaultTextProps) => {
	const styles: SxProps<Theme> = {
		color: "#525252",
		...sx,
	};

	return (
		<Typography variant={variant} sx={styles} {...props}>
			{children}
		</Typography>
	);
};

export default Text;
