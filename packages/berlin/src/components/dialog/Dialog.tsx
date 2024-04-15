// React and third-party libraries
import { Close, Description, Portal, Root, Title, Trigger } from '@radix-ui/react-dialog';

// Components
import { Body } from '../typography/Body.styled';
import { FlexColumn } from '../containers/FlexColum.styled';
import { FlexRowToColumn } from '../containers/FlexRowToColumn.styled';
import Button from '../button';

// Styled Components
import { DialogContent, DialogOverlay } from './Dialog.styled';

type DialogProps = {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  content?: React.ReactNode;
  dialogButtons?: boolean;
  actionButtonText?: string;
  onActionClick?: () => void;
};

const Dialog = ({
  trigger,
  title,
  description,
  content,
  dialogButtons = true,
  actionButtonText,
  onActionClick,
}: DialogProps) => (
  <Root>
    <Trigger asChild>{trigger}</Trigger>
    <Portal>
      <DialogOverlay />
      <DialogContent asChild>
        <FlexColumn>
          <Title>{title}</Title>
          <Description asChild>
            <Body>{description}</Body>
          </Description>
          {content}
          {dialogButtons && (
            <FlexRowToColumn $gap="0.5rem" $justify="flex-end">
              <Close asChild>
                <Button $color="secondary">Cancel</Button>
              </Close>
              <Close asChild>
                <Button onClick={onActionClick}>{actionButtonText}</Button>
              </Close>
            </FlexRowToColumn>
          )}
        </FlexColumn>
      </DialogContent>
    </Portal>
  </Root>
);

export default Dialog;
