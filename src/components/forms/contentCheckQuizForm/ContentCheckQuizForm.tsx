import PdfViewer from '@components/pdfViewer/PdfViewer';
import { IPFS_GATEWAY_URL } from '@global/constants/general';
import { nthFormat } from '@global/helpers/number';
import {
  Box,
  Button,
  Divider,
  Stack, TextField, Typography
} from '@mui/material';
import { Field, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';

type Props = {
  quizIpfsHash: string;
  accountQuestionIndexes: number[];
  completeVotingQuizFn: any;
};

type Question = {
  originalIndex: number;
  questionIndex: number;
};

type QuizInfo = {
  accountQuestionIndexes: Question[];
};

const ContentCheckQuizForm = ({
  quizIpfsHash,
  accountQuestionIndexes,
  completeVotingQuizFn
}: Props) => {
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

  return (
    <Stack spacing={2}>
      <PdfViewer documentUrl={`${IPFS_GATEWAY_URL}/${quizIpfsHash}`} />
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
        <Button variant="contained" onClick={() => completeVotingQuizFn(answers)}>COMPLETE QUIZ</Button>
      </Stack>
    </Stack>
  );
};
export default ContentCheckQuizForm;
