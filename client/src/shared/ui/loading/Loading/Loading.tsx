import { Box, CircularProgress, type CircularProgressProps } from "@mui/material";

export const Loading = ({ ...props }: CircularProgressProps) => {
	return (
		<Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
			<CircularProgress aria-label="Loading…" {...props} />
		</Box>
	);
};
