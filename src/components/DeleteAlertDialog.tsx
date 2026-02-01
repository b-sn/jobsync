import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { buttonVariants } from "./ui/button";
import { useTranslations } from "next-intl";

interface DeleteAlertDialogProps {
  pageTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  alertTitle?: string;
  alertDescription?: string;
  deleteAction?: boolean;
}

export function DeleteAlertDialog({
  pageTitle,
  open,
  onOpenChange,
  onDelete,
  alertTitle,
  alertDescription = "This action cannot be undone. This will permanently delete and remove data from server.",
  deleteAction = true,
}: DeleteAlertDialogProps) {
  const tc = useTranslations("common");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {alertTitle ?? `Are you sure you want to delete this ${pageTitle}?`}
          </AlertDialogTitle>
          <AlertDialogDescription>{alertDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tc("cancel")}</AlertDialogCancel>
          {deleteAction && (
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={onDelete}
            >
              {tc("delete")}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
