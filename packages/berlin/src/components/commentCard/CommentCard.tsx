import { GetCommentsResponse } from 'api';
import { Body } from '../typography/Body.styled';
import { Card, FormattedDate, Username } from './CommentCard.styled';
import IconButton from '../iconButton';
import { useAppStore } from '../../store';
import { FlexRow } from '../containers/FlexRow.styled';

type CommentCardProps = {
  comment: GetCommentsResponse[number];
};

function CommentCard({ comment }: CommentCardProps) {
  const theme = useAppStore((state) => state.theme);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedDate = formatter.format(new Date(comment.createdAt));

  return (
    <Card key={comment.id}>
      <Username>{comment.user?.username}</Username>
      <FormattedDate>{formattedDate}</FormattedDate>
      <Body>{comment.value}</Body>
      <FlexRow $gap="0.25rem" $justify="flex-end">
        <IconButton
          // onClick={}
          // disabled={}
          icon={{ src: `/icons/thumb-down-${theme}.svg`, alt: 'Thumb down icon' }}
          $color="secondary"
          $height={20}
          $width={20}
        />
        <IconButton
          // onClick={}
          // disabled={}
          icon={{ src: `/icons/thumb-up-${theme}.svg`, alt: 'Thumb up icon' }}
          $color="secondary"
          $height={20}
          $width={20}
        />
      </FlexRow>
    </Card>
  );
}

export default CommentCard;
