import PdfViewer from '@components/pdfViewer/PdfViewer';
import { showSuccessToast } from '@components/toasts/Toasts';
import { VotingInfo } from '@components/types/Types';
import { IPFS_GATEWAY_URL } from '@global/constants/general';
import { nthFormat } from '@global/helpers/number';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import {
  Box,
  Button,
  Divider,
  Stack, TextField, Typography
} from '@mui/material';
import { Field, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';

type Props = {
  votingInfo: VotingInfo;
  setVotingInfo: React.Dispatch<React.SetStateAction<VotingInfo | undefined>>;
  accountQuestionIndexes: number[];
};

type Question = {
  originalIndex: number;
  questionIndex: number;
};

type QuizInfo = {
  accountQuestionIndexes: Question[];
};

const ContentCheckQuizForm = ({
  votingInfo,
  setVotingInfo,
  accountQuestionIndexes
}: Props) => {
  const {
    completeVotingContentCheckQuiz
  } = useContract();
  const [quizInfo, setQuizInfo] = useState<QuizInfo>();
  const [answers, setAnswers] = useState<string[]>([]);

  const { handleChange, setFieldValue } = useFormikContext();

  useEffect(() => {
    const renderQuizInfo = async () => {
      setQuizInfo({
        accountQuestionIndexes: accountQuestionIndexes.map((qIndex, index) => ({
          originalIndex: index,
          questionIndex: qIndex
        }))
      });
    };

    renderQuizInfo();
  }, [accountQuestionIndexes]);

  const completeVotingQuiz = async () => {
    await asyncErrWrapper(completeVotingContentCheckQuiz)(
      votingInfo.key || '',
      answers
    ).then(() => {
      setVotingInfo({
        ...votingInfo,
        vote: {
          ...votingInfo.vote,
          isContentQuizCompleted: true
        }
      });
      showSuccessToast('Voting quiz successfully completed');
    });
  };

  return (
    <Stack spacing={2}>
      <PdfViewer documentUrl={`${IPFS_GATEWAY_URL}/${votingInfo.contentCheckQuizIpfsHash}`} />
      <Divider />
      <Stack spacing={2}>
        {quizInfo?.accountQuestionIndexes.sort(
          (a, b) => a.questionIndex - b.questionIndex
        ).map(({ questionIndex, originalIndex }) => (
          <Stack spacing={2} direction="row" key={`question-${questionIndex}`}>
            <Box sx={{ display: 'grid', alignItems: 'center' }}>
              <Typography sx={{ minWidth: '150px' }}>{(questionIndex)}. question</Typography>
            </Box>
            <Field
              as={TextField}
              name={`answer-${questionIndex}`}
              label={`Answer for the ${nthFormat(questionIndex)} question`}
              fullWidth
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(e);
                setFieldValue(`answer-${questionIndex}`, e.target.value);

                const _answers = Object.assign([], answers) as string[];
                _answers[originalIndex] = e.target.value;
                setAnswers(_answers);
              }}
            />
          </Stack>
        ))}
        <Button variant="contained" onClick={completeVotingQuiz}>COMPLETE QUIZ</Button>
      </Stack>
    </Stack>
  );
};
export default ContentCheckQuizForm;
