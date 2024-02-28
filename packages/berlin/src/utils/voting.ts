import { GetUserVotesResponse, PostVotesRequest } from 'api';
import { ResponseUserVotesType } from '../types/CycleType';
import toast from 'react-hot-toast';

export const handleVote = (
  optionId: string,
  avaliableHearts: number,
  setAvaliableHearts: (hearts: number) => void,
  setLocalUserVotes: React.Dispatch<
    React.SetStateAction<
      | ResponseUserVotesType
      | {
          optionId: string;
          numOfVotes: number;
        }[]
    >
  >,
) => {
  if (avaliableHearts > 0) {
    setLocalUserVotes((prevLocalUserVotes) => {
      const temp = prevLocalUserVotes.find((x) => x.optionId === optionId);
      if (!temp) {
        return [...prevLocalUserVotes, { optionId, numOfVotes: 1 }];
      }
      const updatedLocalVotes = prevLocalUserVotes.map((prevLocalUserVote) => {
        if (prevLocalUserVote.optionId === optionId) {
          return { ...prevLocalUserVote, numOfVotes: prevLocalUserVote.numOfVotes + 1 };
        }
        return prevLocalUserVote;
      });
      return updatedLocalVotes;
    });
    setAvaliableHearts(Math.max(0, avaliableHearts - 1));
  }
};

export const handleUnvote = (
  optionId: string,
  avaliableHearts: number,
  setAvaliableHearts: (hearts: number) => void,
  setLocalUserVotes: React.Dispatch<
    React.SetStateAction<
      | ResponseUserVotesType
      | {
          optionId: string;
          numOfVotes: number;
        }[]
    >
  >,
) => {
  setLocalUserVotes((prevLocalUserVotes) => {
    const updatedLocalVotes = prevLocalUserVotes.map((prevLocalUserVote) => {
      if (prevLocalUserVote.optionId === optionId) {
        const newNumOfVotes = Math.max(0, prevLocalUserVote.numOfVotes - 1);
        return { ...prevLocalUserVote, numOfVotes: newNumOfVotes };
      }
      return prevLocalUserVote;
    });

    return updatedLocalVotes;
  });

  setAvaliableHearts(Math.min(20, avaliableHearts + 1));
};

export const handleSaveVotes = (
  userVotes: GetUserVotesResponse | null | undefined,
  localUserVotes:
    | ResponseUserVotesType
    | {
        optionId: string;
        numOfVotes: number;
      }[],
  cycleId: string | undefined,
  mutateVotes: (data: PostVotesRequest) => void,
) => {
  try {
    if (userVotes) {
      const serverVotesMap = new Map(userVotes.map((vote) => [vote.optionId, vote]));
      const mutateVotesReq: PostVotesRequest = {
        cycleId: cycleId || '',
        votes: [],
      };

      for (const localVote of localUserVotes) {
        const matchingServerVote = serverVotesMap.get(localVote.optionId);

        if (!matchingServerVote) {
          mutateVotesReq.votes.push({
            optionId: localVote.optionId,
            numOfVotes: localVote.numOfVotes,
          });
        } else if (matchingServerVote.numOfVotes !== localVote.numOfVotes) {
          mutateVotesReq.votes.push({
            optionId: localVote.optionId,
            numOfVotes: localVote.numOfVotes,
          });
        }
      }

      mutateVotes(mutateVotesReq);
    }
  } catch (error) {
    toast.error('Failed to save votes, please try again');
    console.error('Error saving votes:', error);
  }
};
