import { Box } from "@mui/material";
import { Text } from "@shared/ui/text";

export interface IErrorCardProps {
	message: string;
}

export const ErrorCard = ({ message }: IErrorCardProps) => {
	return (
		<Box>
			<Text>{message}</Text>
		</Box>
	);
};
