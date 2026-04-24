import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import Home from "../app/(tabs)/Home";
import { UserContext } from "../context/UserContext";

const mockReplace = jest.fn();
const mockGeneratePress = jest.fn();

jest.mock("expo-router", () => ({
    useRouter: () => ({
        replace: mockReplace
    })
}));

jest.mock("../components/HomeHeader", () => {
    return function MockHomeHeader() {
        const ReactLib = require("react");
        const { Text } = require("react-native");
        return ReactLib.createElement(Text, {}, "Home Header");
    };
});

jest.mock("../components/TodayProgress", () => {
    return function MockTodayProgress() {
        const ReactLib = require("react");
        const { Text } = require("react-native");
        return ReactLib.createElement(Text, {}, "Today Progress");
    };
});

jest.mock("../components/GenerateRecipeCard", () => {
    return function MockGenerateRecipeCard() {
        const ReactLib = require("react");
        const { TouchableOpacity, Text } = require("react-native");
        return ReactLib.createElement(
            TouchableOpacity,
            { onPress: mockGeneratePress },
            ReactLib.createElement(Text, {}, "Generate Recipe")
        );
    };
});

jest.mock("../components/TodaysMealPlan", () => {
    return function MockTodaysMealPlan() {
        const ReactLib = require("react");
        const { Text } = require("react-native");
        return ReactLib.createElement(Text, {}, "Today's Meal Plan");
    };
});

describe("HomeScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders without crashing", () => {
        const { toJSON } = render(
            <UserContext.Provider value={{ user: { weight: 60 } }}>
                <Home />
            </UserContext.Provider>
        );

        expect(toJSON()).toBeTruthy();
    });

    it("shows core UI elements", () => {
        const { getByText } = render(
            <UserContext.Provider value={{ user: { weight: 60 } }}>
                <Home />
            </UserContext.Provider>
        );

        expect(getByText("Home Header")).toBeTruthy();
        expect(getByText("Today Progress")).toBeTruthy();
        expect(getByText("Today's Meal Plan")).toBeTruthy();
    });

    it("handles button press from recipe card", () => {
        const { getByText } = render(
            <UserContext.Provider value={{ user: { weight: 60 } }}>
                <Home />
            </UserContext.Provider>
        );

        fireEvent.press(getByText("Generate Recipe"));

        expect(mockGeneratePress).toHaveBeenCalledTimes(1);
    });
});
