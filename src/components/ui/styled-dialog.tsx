
import React from 'react';
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StyledDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  showClose?: boolean;
  footerContent?: React.ReactNode;
}

export function StyledDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  showClose = true,
  footerContent
}: StyledDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "bg-gray-100 rounded-xl border border-gray-200 shadow-lg max-w-3xl overflow-hidden",
        className
      )}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        
        {showClose && (
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        )}
        
        <div className={cn(
          "rounded-lg bg-white border border-gray-100 p-4",
          !title && !description && "mt-2"
        )}>
          {children}
        </div>
        
        {footerContent && (
          <DialogFooter className="flex justify-end space-x-2">
            {footerContent}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ReleaseDialog({
  open,
  onOpenChange,
  title,
  content,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
}) {
  return (
    <StyledDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Release original"
      className="max-w-3xl"
    >
      <div className="prose max-w-none">
        {content.split('\n').map((paragraph, idx) => (
          paragraph ? <p key={idx} className="mb-4">{paragraph}</p> : <br key={idx} />
        ))}
      </div>
      
      <DialogFooter className="mt-4 pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Fechar
        </Button>
      </DialogFooter>
    </StyledDialog>
  );
}
