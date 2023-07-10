import * as yup from 'yup';

export const scoreValidationSchema = yup.object().shape({
  score: yup.number().integer().required(),
  candidate_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
