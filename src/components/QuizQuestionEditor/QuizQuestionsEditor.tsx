import Label from '@components/general/Label/Label';
import LabelText from '@components/general/LabelText/LabelText';
import {
  Button, List, ListItem, Stack, TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';

type Props = {
  minAnswersRequired: number,
  answers: string[],
  setAnswers: React.Dispatch<React.SetStateAction<string[]>>
};

const QuizQuestionEditor = ({ answers, setAnswers, minAnswersRequired }: Props) => {
  const [answer, setAnswer] = useState('');
  const addAnswer = () => {
    setAnswers([
      ...answers,
      answer
    ]);
    setAnswer('');
  };
  return (
    <Stack spacing={2}>
      <LabelText label="Added answers count:" text={`${answers.length} / ${minAnswersRequired}`} />
      <Stack spacing={2}>
        <List>
          {answers.map((_answer, index) => (
            <ListItem key={_answer}>
              <Typography sx={{ mr: '5px' }}>{`${(index + 1)}. `}</Typography>
              {_answer}
            </ListItem>
          ))}
        </List>
      </Stack>
      <Stack direction="row" spacing={2}>
        <Label text="Next answer:" />
        <TextField value={answer} name="new-answer" sx={{ width: '400px' }} onChange={(e) => { setAnswer(e.target.value); }} />
        <Button variant="contained" onClick={addAnswer}>ADD</Button>
      </Stack>
    </Stack>
  );
};

export default QuizQuestionEditor;
