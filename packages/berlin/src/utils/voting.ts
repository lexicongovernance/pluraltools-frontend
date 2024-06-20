import { GetUserVotesResponse, PostVotesRequest } from 'api';
import toast from 'react-hot-toast';
import { INITIAL_HEARTS } from './constants';

export const handleLocalVote = (
  optionId: string,
  prevLocalUserVotes: { optionId: string; numOfVotes: number }[],
) => {
  // find if the user has already voted for this option
  const prevVote = prevLocalUserVotes.find((x) => x.optionId === optionId);
  if (!prevVote) {
    // if the user has not voted for this option, add a new vote
    return [...prevLocalUserVotes, { optionId, numOfVotes: 1 }];
  }

  // if the user has already voted for this option, update the number of votes
  // this will just find the option and increase the number of votes by 1
  const updatedLocalVotes = prevLocalUserVotes.map((prevLocalUserVote) => {
    if (prevLocalUserVote.optionId === optionId) {
      return { ...prevLocalUserVote, numOfVotes: prevLocalUserVote.numOfVotes + 1 };
    }
    return prevLocalUserVote;
  });

  return updatedLocalVotes;
};

export const handleLocalUnVote = (
  optionId: string,
  prevLocalUserVotes: { optionId: string; numOfVotes: number }[],
) => {
  // this will just find the option and decrease the number of votes by 1
  const updatedLocalVotes = prevLocalUserVotes.map((prevLocalUserVote) => {
    if (prevLocalUserVote.optionId === optionId) {
      const newNumOfVotes = Math.max(0, prevLocalUserVote.numOfVotes - 1);
      return { ...prevLocalUserVote, numOfVotes: newNumOfVotes };
    }
    return prevLocalUserVote;
  });

  return updatedLocalVotes;
};

export const handleAvailableHearts = (availableHearts: number, type: 'vote' | 'unVote') => {
  if (type === 'vote') {
    return Math.max(0, availableHearts - 1);
  }

  return Math.min(INITIAL_HEARTS, availableHearts + 1);
};

export const handleSaveVotes = (
  userVotes: GetUserVotesResponse | null | undefined,
  localUserVotes: {
    optionId: string;
    numOfVotes: number;
  }[],
  mutateVotes: (data: PostVotesRequest) => void,
) => {
  try {
    if (userVotes) {
      const serverVotesMap = new Map(userVotes.map((vote) => [vote.optionId, vote]));
      const mutateVotesReq: PostVotesRequest = {
        votes: [],
      };

      for (const localVote of localUserVotes) {
        const matchingServerVote = serverVotesMap.get(localVote.optionId);
        // if the vote is the same as the server vote, we don't need to send it
        if (matchingServerVote && matchingServerVote.numOfVotes === localVote.numOfVotes) {
          continue;
        }

        mutateVotesReq.votes.push({
          optionId: localVote.optionId,
          numOfVotes: localVote.numOfVotes,
        });
      }

      mutateVotes(mutateVotesReq);
    }
  } catch (error) {
    toast.error('Failed to save votes, please try again');
    console.error('Error saving votes:', error);
  }
};
