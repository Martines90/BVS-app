import Label from '@components/general/Label/Label';
import LabelText from '@components/general/LabelText/LabelText';
import {
  Button, List, ListItem, Stack, TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';

type Props = {
  answers: string[],
  setAnswers: React.Dispatch<React.SetStateAction<string[]>>
};

const QuizQuestionEditor = ({ answers, setAnswers }: Props) => {
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
      <LabelText label="Correct answer count:" text={answers.length} />
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
        <Button variant="contained" onClick={addAnswer}>Add</Button>
      </Stack>
    </Stack>
  );
};

export default QuizQuestionEditor;
