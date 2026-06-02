import { Box } from "@mui/material";

type TCenterElementProps = {
	children: React.ReactNode;
	directory?: "column" | "column-reverse" | "row" | "row-reverse";
};

const CenterElement = ({ children, directory = "column" }: TCenterElementProps) => {
	return <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: directory }}>{children}</Box>;
};

export default CenterElement;
