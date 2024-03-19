// React and third-party libraries
import { Root, Trigger, Portal, Cancel, Action } from '@radix-ui/react-alert-dialog';

// Components
import { Body } from '../typography/Body.styled';
import { FlexColumn } from '../containers/FlexColum.styled';
import { FlexRowToColumn } from '../containers/FlexRowToColumn.styled';
import Button from '../button';

// Styled Components
import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogTitle,
} from './AlertDialog.styled';

type AlertDialogProps = {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  actionButtonText: string;
  onActionClick: () => void;
};

const AlertDialog = ({
  trigger,
  title,
  description,
  actionButtonText,
  onActionClick,
}: AlertDialogProps) => (
  <Root>
    <Trigger asChild>{trigger}</Trigger>
    <Portal>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <FlexColumn>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            <Body>{description}</Body>
          </AlertDialogDescription>
          <FlexRowToColumn $gap="0.5rem" $justify="flex-end">
            <Cancel asChild>
              <Button $color="secondary">Cancel</Button>
            </Cancel>
            <Action asChild>
              <Button onClick={onActionClick}>{actionButtonText}</Button>
            </Action>
          </FlexRowToColumn>
        </FlexColumn>
      </AlertDialogContent>
    </Portal>
  </Root>
);

export default AlertDialog;
