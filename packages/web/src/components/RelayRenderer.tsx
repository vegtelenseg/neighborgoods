import * as React from 'react';
import {useQuery} from 'relay-hooks';
import {QueryOptions} from 'relay-hooks/lib/RelayHooksType';
import {GraphQLTaggedNode} from 'react-relay';
import Error from './Error';
import {OperationType} from 'relay-runtime';
import CircularProgress from '@material-ui/core/CircularProgress';

interface QueryRendererProps<R extends OperationType> {
  variables: R['variables'] | (() => R['variables']);
  query: GraphQLTaggedNode;
  queryOpts?: QueryOptions;
  children: (data: R['response']) => JSX.Element | null; // blegh
  // Allow customization of loading component
  loading?: null | React.ReactElement | (() => React.ReactElement);
}

//R is the queryResponseType
export function RelayRenderer<R extends OperationType = OperationType>({
  query,
  variables,
  children,
  loading,
  queryOpts,
}: QueryRendererProps<R>) {
  const queryVariables =
    typeof variables === 'function' ? variables() : variables;
  const queryOptions = queryOpts ? queryOpts : {};
  const {props, error, retry} = useQuery<R>(
    query,
    queryVariables,
    queryOptions
  );
  // const classes = useStyles();
  if (error) {
    return <Error retry={retry as () => void} error={error}></Error>;
  }

  if (!props) {
    // Passing in null can be used to suppress the spinner
    if (loading !== undefined) {
      if (typeof loading === 'function') {
        return loading();
      } else {
        return loading;
      }
    }
    return <CircularProgress color="primary" size={45} />;
  }

  return children(props);
}

// TODO: remove
export default RelayRenderer;
