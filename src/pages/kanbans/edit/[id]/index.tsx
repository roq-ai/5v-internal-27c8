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
import { getKanbanById, updateKanbanById } from 'apiSdk/kanbans';
import { Error } from 'components/error';
import { kanbanValidationSchema } from 'validationSchema/kanbans';
import { KanbanInterface } from 'interfaces/kanban';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CandidateInterface } from 'interfaces/candidate';
import { getCandidates } from 'apiSdk/candidates';

function KanbanEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<KanbanInterface>(
    () => (id ? `/kanbans/${id}` : null),
    () => getKanbanById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: KanbanInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateKanbanById(id, values);
      mutate(updated);
      resetForm();
      router.push('/kanbans');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<KanbanInterface>({
    initialValues: data,
    validationSchema: kanbanValidationSchema,
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
            Edit Kanban
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
            <FormControl id="stage" mb="4" isInvalid={!!formik.errors?.stage}>
              <FormLabel>Stage</FormLabel>
              <Input type="text" name="stage" value={formik.values?.stage} onChange={formik.handleChange} />
              {formik.errors.stage && <FormErrorMessage>{formik.errors?.stage}</FormErrorMessage>}
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
    entity: 'kanban',
    operation: AccessOperationEnum.UPDATE,
  }),
)(KanbanEditPage);
