import type { FC } from "react";
import type { ChatListType } from "../../types/ChatListTypes";
import { SingleChatBar } from "./SingleChatBar";
import { FriendChatBar } from "./FriendChatBar";

interface PropType {
	chat: ChatListType;
	onClick: (id: string) => void;
}

export const ChatBar: FC<PropType> = ({ chat, onClick }) => {
	switch (chat.type) {
		case "chat":
			return <SingleChatBar chat={chat} onClick={onClick} />;
		case "friend":
			return <FriendChatBar friend={chat} onClick={onClick} />;
	}
};
