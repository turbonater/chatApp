import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Button from "../UI/Button";
import Input from "../UI/Input";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 400px;
  max-width: 700px;
  height: 600px;
  background: #e2e2e2;
  margin: 7em;
  border: 1px solid black;
`;

const Header = styled.div`
  width: auto;
  padding: 0.65em;
  background: lightblue;
  border-bottom: 1px solid black;
  font-family: "Roboto Mono", monospace;
  font-weight: 800;
`;

const MessagesContainer = styled.div`
  /* display: flex;
  flex-direction: column; */
  background: #fff;
  padding: 1em 1.5em;
  flex-grow: 1;
  overflow-y: auto;
`;

const Footer = styled.div`
  width: auto;
  display: flex;
  background: lightblue;
  border-top: 1px solid black;
`;

const NoMessages = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  color: grey;
  font-size: 14px;
  font-family: "Roboto Mono", monospace;
`;

const inputStyles = { borderWidth: 0, flexGrow: 1 };

const buttonStyles = {
  borderTop: 0,
  borderRight: 0,
  borderBottom: 0,
};

const Window = ({ heading, children, onSendMessage }) => {
  const [inputVal, setInputVal] = useState("");
  const messageContainerRef = useRef();
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (messageContainerRef) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
      messageContainerRef.current.addEventListener(
        "DOMNodeInserted",
        (event) => {
          const { currentTarget: target } = event;
          target.scroll({ top: target.scrollHeight, behavior: "smooth" });
        }
      );
    }
  }, []);

  return (
    <Container>
      <Header>{heading}</Header>
      <MessagesContainer ref={messageContainerRef}>
        {children.length < 1 ? (
          <NoMessages>No Messages in the chat yet!</NoMessages>
        ) : (
          children
        )}
      </MessagesContainer>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSendMessage(inputVal);
          setInputVal("");
        }}
      >
        <Footer>
          <Input
            value={inputVal}
            onChange={(event) => {
              setInputVal(event.target.value);
              if (event.target.value !== "") {
                setIsDisabled(false);
              } else {
                setIsDisabled(true);
              }
            }}
            placeholder="Write a message..."
            style={inputStyles}
          />
          <Button disabled={isDisabled} type="submit" style={buttonStyles}>
            Send
          </Button>
        </Footer>
      </form>
    </Container>
  );
};

export default Window;
