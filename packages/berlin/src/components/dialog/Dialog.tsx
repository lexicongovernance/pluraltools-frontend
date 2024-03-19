// React and third-party libraries
import { Root, Trigger, Portal, Cancel, Action } from '@radix-ui/react-alert-dialog';

// Components
import { Body } from '../typography/Body.styled';
import { FlexColumn } from '../containers/FlexColum.styled';
import { FlexRowToColumn } from '../containers/FlexRowToColumn.styled';
import Button from '../button';

// Styled Components
import { DialogContent, DialogDescription, DialogOverlay, DialogTitle } from './Dialog.styled';

type DialogProps = {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  actionButtonText: string;
  onActionClick: () => void;
};

const Dialog = ({ trigger, title, description, actionButtonText, onActionClick }: DialogProps) => (
  <Root>
    <Trigger asChild>{trigger}</Trigger>
    <Portal>
      <DialogOverlay />
      <DialogContent>
        <FlexColumn>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            <Body>{description}</Body>
          </DialogDescription>
          <FlexRowToColumn $gap="0.5rem" $justify="flex-end">
            <Cancel asChild>
              <Button $color="secondary">Cancel</Button>
            </Cancel>
            <Action asChild>
              <Button onClick={onActionClick}>{actionButtonText}</Button>
            </Action>
          </FlexRowToColumn>
        </FlexColumn>
      </DialogContent>
    </Portal>
  </Root>
);

export default Dialog;
