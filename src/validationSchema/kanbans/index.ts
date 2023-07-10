import * as yup from 'yup';

export const kanbanValidationSchema = yup.object().shape({
  stage: yup.string().required(),
  candidate_id: yup.string().nullable(),
});
