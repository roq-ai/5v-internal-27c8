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
import { getCandidateById, updateCandidateById } from 'apiSdk/candidates';
import { Error } from 'components/error';
import { candidateValidationSchema } from 'validationSchema/candidates';
import { CandidateInterface } from 'interfaces/candidate';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { JobInterface } from 'interfaces/job';
import { getJobs } from 'apiSdk/jobs';

function CandidateEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CandidateInterface>(
    () => (id ? `/candidates/${id}` : null),
    () => getCandidateById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: CandidateInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateCandidateById(id, values);
      mutate(updated);
      resetForm();
      router.push('/candidates');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<CandidateInterface>({
    initialValues: data,
    validationSchema: candidateValidationSchema,
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
            Edit Candidate
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
            <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
              {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="email" mb="4" isInvalid={!!formik.errors?.email}>
              <FormLabel>Email</FormLabel>
              <Input type="text" name="email" value={formik.values?.email} onChange={formik.handleChange} />
              {formik.errors.email && <FormErrorMessage>{formik.errors?.email}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<JobInterface>
              formik={formik}
              name={'job_id'}
              label={'Select Job'}
              placeholder={'Select Job'}
              fetcher={getJobs}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.title}
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
    entity: 'candidate',
    operation: AccessOperationEnum.UPDATE,
  }),
)(CandidateEditPage);
