import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth, db } from "../../firebase";

const formatDate = (unixTime) => new Date(unixTime * 1000).toLocaleTimeString();

const initialState = {
  messages: null,
  status: "pending", // "pending" || "success" || "error" //
  error: null,
};

export const updateMessages = createAsyncThunk(
  "messages/updateMessages",
  async (roomId, thunkApi) => {
    const user = auth.currentUser;
    if (!user || !roomId) thunkApi.rejectWithValue("No messages found!");
    const messagesRef = db
      .collection("chat-rooms")
      .doc(roomId)
      .collection("messages");
    const unSubscribe = messagesRef
      .orderBy("at", "asc")
      .onSnapshot((snapshot) => {
        const messages = snapshot.docs.map((doc) => {
          const message = doc.data();
          return { ...message, at: formatDate(message.at.seconds) };
        });
        thunkApi.dispatch(messagesSlice.actions.setMessages(messages));
      });
    // return { unSubscribe };
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ roomId, message }) => {
    console.log("MESSAGE =>", typeof message, message);
    const user = auth.currentUser;
    const roomRef = db.collection("chat-rooms").doc(roomId);
    const messagesRef = roomRef.collection("messages");
    const messageRef = messagesRef.doc();
    await messageRef.set({
      id: messageRef.id,
      user: user.displayName,
      text: message,
      at: new Date(),
    });

    // let messages = [];
    // const updatedMessages = await messagesRef.get();
    // await updatedMessages.forEach((doc) => {
    //   const { at, ...rest } = doc.data();
    //   const date = new Date(at.seconds * 1000).toLocaleTimeString();
    //   messages.push({ ...rest, at: date });
    // });
  }
);

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
  extraReducers: {
    [sendMessage.fulfilled]: (state) => {
      state.status = "success";
    },
    [sendMessage.pending]: (state) => {
      state.status = "pending";
    },
    [updateMessages.fulfilled]: (state) => {
      state.status = "success";
    },
  },
});
