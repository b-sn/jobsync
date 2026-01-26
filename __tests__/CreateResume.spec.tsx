import CreateResume from "@/components/profile/CreateResume";
import { Resume } from "@/models/profile.model";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("CreateResume Component", () => {
  const mockReloadResumes = jest.fn();
  const mockSetResumeDialogOpen = jest.fn();
  const mockSetNewResumeId = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  const renderComponent = async (resumeToEdit?: Resume) => {
    render(
      <CreateResume
        resumeDialogOpen={true}
        setResumeDialogOpen={mockSetResumeDialogOpen}
        resumeToEdit={resumeToEdit}
        reloadResumes={mockReloadResumes}
        setNewResumeId={mockSetNewResumeId}
      />
    );

    const expectedTitle = resumeToEdit?.title ?? "";
    await waitFor(() => {
      expect(screen.getByTestId("resume-title-input")).toHaveValue(expectedTitle);
    });
  };

  it("should render the dialog when resumeDialogOpen is true", async () => {
    await renderComponent();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/create resume/i)).toBeInTheDocument();
  });

  it("should display the correct title when editing a resume", async () => {
    const mockResumeToEdit = {
      id: "resume-id",
      title: "Test Resume",
      FileId: "file-id",
    } as Resume;

    await renderComponent(mockResumeToEdit);

    expect(screen.getByText(/edit resume title/i)).toBeInTheDocument();
    expect(screen.getByTestId("resume-title-input")).toHaveValue("Test Resume");
  });

  it("should display the correct title when creating a new resume", async () => {
    await renderComponent();
    expect(screen.getByText(/create resume/i)).toBeInTheDocument();
    expect(screen.getByTestId("resume-title-input")).toHaveValue("");
  });

  it("should call setResumeDialogOpen with false when cancel button is clicked", async () => {
    await renderComponent();

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockSetResumeDialogOpen).toHaveBeenCalledWith(false);
  });

  it("should display validation errors when form is invalid", async () => {
    await renderComponent();

    const titleInput = screen.getByTestId("resume-title-input");
    fireEvent.change(titleInput, { target: { value: "Temporary Title" } });
    fireEvent.change(titleInput, { target: { value: "" } });

    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(saveButton).toBeDisabled();

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/resume title is required/i)).toBeInTheDocument();
    });
  });
});
