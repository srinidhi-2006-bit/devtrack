import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import DashboardHeader from "../DashboardHeader";
import { useSession } from "next-auth/react";

jest.mock("next-auth/react");

jest.mock("@/components/NotificationBell", () => {
  const MockNotificationBell = () => <div>NotificationBell</div>;
  MockNotificationBell.displayName = "MockNotificationBell";
  return MockNotificationBell;
});

jest.mock("@/components/AccountToggle", () => {
  const MockAccountToggle = () => <div>AccountToggle</div>;
  MockAccountToggle.displayName = "MockAccountToggle";
  return MockAccountToggle;
});

jest.mock("@/components/SignOutButton", () => {
  const MockSignOutButton = () => <div>SignOutButton</div>;
  MockSignOutButton.displayName = "MockSignOutButton";
  return MockSignOutButton;
});

jest.mock("@/components/ThemeToggle", () => {
  const MockThemeToggle = () => <div>ThemeToggle</div>;
  MockThemeToggle.displayName = "MockThemeToggle";
  return MockThemeToggle;
});

jest.mock("@/components/UserAvatar", () => {
  const MockUserAvatar = () => <div>UserAvatar</div>;
  MockUserAvatar.displayName = "MockUserAvatar";
  return MockUserAvatar;
});

jest.mock("@/components/KeyboardShortcuts", () => {
  const MockKeyboardShortcuts = () => <div>KeyboardShortcuts</div>;
  MockKeyboardShortcuts.displayName = "MockKeyboardShortcuts";
  return MockKeyboardShortcuts;
});

const mockedUseSession = useSession as jest.Mock;

describe("DashboardHeader", () => {
  beforeEach(() => {
    global.fetch = jest.fn() as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders Dashboard heading", () => {
    mockedUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<DashboardHeader />);

    expect(
      screen.getByText(/Dashboard/i)
    ).toBeInTheDocument();
  });

  it("renders subtitle text", () => {
    mockedUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<DashboardHeader />);

    expect(
      screen.getByText(/coding activity at a glance/i)
    ).toBeInTheDocument();
  });

  it("does not fetch settings when session is null", () => {
    mockedUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<DashboardHeader />);

    expect(fetch).not.toHaveBeenCalled();
  });

  it("fetches user settings on mount when session exists", async () => {
    mockedUseSession.mockReturnValue({
      data: {
        githubLogin: "testuser",
      },
      status: "authenticated",
    });

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        is_public: true,
      }),
    });

    render(<DashboardHeader />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/user/settings");
    });
  });
});
