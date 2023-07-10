import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getScoreById, updateScoreById } from 'apiSdk/scores';
import { Error } from 'components/error';
import { scoreValidationSchema } from 'validationSchema/scores';
import { ScoreInterface } from 'interfaces/score';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CandidateInterface } from 'interfaces/candidate';
import { UserInterface } from 'interfaces/user';
import { getCandidates } from 'apiSdk/candidates';
import { getUsers } from 'apiSdk/users';

function ScoreEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ScoreInterface>(
    () => (id ? `/scores/${id}` : null),
    () => getScoreById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ScoreInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateScoreById(id, values);
      mutate(updated);
      resetForm();
      router.push('/scores');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ScoreInterface>({
    initialValues: data,
    validationSchema: scoreValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Score
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="score" mb="4" isInvalid={!!formik.errors?.score}>
              <FormLabel>Score</FormLabel>
              <NumberInput
                name="score"
                value={formik.values?.score}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('score', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.score && <FormErrorMessage>{formik.errors?.score}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<CandidateInterface>
              formik={formik}
              name={'candidate_id'}
              label={'Select Candidate'}
              placeholder={'Select Candidate'}
              fetcher={getCandidates}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'score',
    operation: AccessOperationEnum.UPDATE,
  }),
)(ScoreEditPage);
