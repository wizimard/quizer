import { Button, type ButtonProps, type SvgIconTypeMap, type SxProps, type Theme } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

export type TButtonWithIconProps = ButtonProps & {
	text: string;
	IconComponent: OverridableComponent<SvgIconTypeMap<object, "svg">> & {
		muiName: string;
	};
};

export const ButtonWithIcon = ({ text, IconComponent, sx, ...props }: TButtonWithIconProps) => {
	const styles: SxProps<Theme> = {
		height: "36.5px",
		display: "flex",
		alignItems: "center",
		gap: "5px",
		...(sx ?? {}),
	};

	return (
		<Button sx={styles} {...props}>
			<IconComponent fontSize="small" sx={{ marginTop: "-2px" }} />
			<span>{text}</span>
		</Button>
	);
};
