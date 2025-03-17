import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Props {
  children: React.ReactNode;
  title: string;
  description: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const DialogComponent = ({
  children,
  title,
  description,
  isOpen,
  setIsOpen,
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogContent className="overflow-auto max-h-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogComponent;
