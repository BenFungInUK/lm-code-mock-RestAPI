import React, { useState, useReducer } from "react";
import axios from "axios";

const initialState = {
  error: null,
  greeting: null,
};

type StateType = {
  error: string | null;
  greeting: string | null;
};

type GreetingAction =
  | {
      type: "SUCCESS";
      greeting: string | null;
    }
  | {
      type: "ERROR";
      error: string | null;
    }
  | {
      type: "TESTING";
      test: string | null;
    };

function greetingReducer(state: StateType, action: GreetingAction) {
  switch (action.type) {
    case "SUCCESS": {
      return {
        error: null,
        greeting: action.greeting,
      };
    }
    case "ERROR": {
      return {
        error: action.error,
        greeting: null,
      };
    }
    case "TESTING": {
      return {
        error: null,
        greeting: action.test,
      };
    }
    default: {
      return state;
    }
  }
}

interface fetchProps {
  url: string;
}

export default function Fetch({ url }: fetchProps) {
  const [{ error, greeting }, dispatch] = useReducer(
    greetingReducer,
    initialState
  );
  const [buttonClicked, setButtonClicked] = useState(false);

  const fetchGreeting = async (url: string) =>
    axios
      .get(url)
      .then((response) => {
        const { data } = response;
        const { greeting } = { greeting: data[0].title };
        dispatch({ type: "SUCCESS", greeting });
        setButtonClicked(true);
      })
      .catch((error) => {
        dispatch({ type: "ERROR", error });
      });

  const buttonText = buttonClicked ? "Ok" : "Load Greeting";

  return (
    <div>
      <button onClick={() => fetchGreeting(url)} disabled={buttonClicked}>
        {buttonText}
      </button>
      {greeting && <h1>{greeting}</h1>}
      {error && <p role="alert">Oops… something went wrong, try again 🤕!</p>}
    </div>
  );
}
