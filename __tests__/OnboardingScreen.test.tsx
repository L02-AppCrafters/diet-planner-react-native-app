import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

import Index from "../app/index";
import { UserContext } from "../context/UserContext";

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockQuery = jest.fn();
const mockOnAuthStateChanged = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace
  })
}));

jest.mock("convex/react", () => ({
  useConvex: () => ({
    query: mockQuery
  })
}));

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: (...args: unknown[]) => mockOnAuthStateChanged(...args)
}));

jest.mock("../services/FirebaseConfig", () => ({
  auth: {}
}));

jest.mock("../convex/_generated/api", () => ({
  api: {
    Users: {
      GetUser: "Users:GetUser"
    }
  }
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons"
}));

jest.mock("../components/shared/Button", () => {
  return function MockButton({ title, onPress }: { title: string; onPress: () => void }) {
    const ReactLib = require("react");
    const { TouchableOpacity, Text } = require("react-native");
    return ReactLib.createElement(
      TouchableOpacity,
      { onPress },
      ReactLib.createElement(Text, {}, title)
    );
  };
});

describe("OnboardingScreen", () => {
  const setUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (user: unknown) => void) => {
      callback(null);
      return jest.fn();
    });
  });

  it("renders correctly", () => {
    const { getByText } = render(
      <UserContext.Provider value={{ user: null, setUser }}>
        <Index />
      </UserContext.Provider>
    );

    expect(getByText("Diet Planner")).toBeTruthy();
    expect(getByText("Get Started")).toBeTruthy();
  });

  it("moves to the next screen when auth user exists", async () => {
    mockQuery.mockResolvedValueOnce({ email: "test@example.com" });
    mockOnAuthStateChanged.mockImplementationOnce(
      (_auth: unknown, callback: (user: { email: string }) => void) => {
        callback({ email: "test@example.com" });
        return jest.fn();
      }
    );

    render(
      <UserContext.Provider value={{ user: null, setUser }}>
        <Index />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(setUser).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(mockReplace).toHaveBeenCalledWith("/(tabs)/Home");
    });
  });

  it("navigates to SignIn when pressing Get Started", () => {
    const { getByText } = render(
      <UserContext.Provider value={{ user: null, setUser }}>
        <Index />
      </UserContext.Provider>
    );

    fireEvent.press(getByText("Get Started"));

    expect(mockPush).toHaveBeenCalledWith("/auth/SignIn");
  });
});
