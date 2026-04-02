"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ResumeLocalDraftDialogProps = {
  open: boolean;
  title: string;
  description: string;
  resumeLabel?: string;
  freshLabel?: string;
  onResume: () => void;
  onStartFresh: () => void;
};

export function ResumeLocalDraftDialog({
  open,
  title,
  description,
  resumeLabel = "Reprendre",
  freshLabel = "Repartir du template",
  onResume,
  onStartFresh,
}: ResumeLocalDraftDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="sm:max-w-md" data-testid="resume-draft-dialog">
        <AlertDialogHeader className="sm:text-left">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <span className="text-muted-foreground text-sm block">{description}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-end gap-2">
          <AlertDialogCancel onClick={onStartFresh}>{freshLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onResume}>{resumeLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
