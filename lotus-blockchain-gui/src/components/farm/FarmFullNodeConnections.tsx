import { Trans } from '@lingui/macro';
import { IconButton, Link, Tooltip, Typography } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import {
  Card, Flex, FormatBytes,
  FormatConnectionStatus, Table
} from '@lotus/core';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import type { RootState } from '../../modules/rootReducer';
import Connection from '../../types/Connection';
import FarmCloseConnection from './FarmCloseConnection';

const StyledIconButton = styled(IconButton)`
  padding: 0.2rem;
`;

const cols = [
  {
    minWidth: '200px',
    field(row: Connection) {
      return (
        <Tooltip title={row.node_id}>
          <span>{row.node_id}</span>
        </Tooltip>
      );
    },
    title: <Trans>Node ID</Trans>,
  },
  {
    field: 'peer_host',
    title: <Trans>Host Name</Trans>,
  },
  {
    field(row: Connection) {
      return `${row.peer_port}/${row.peer_server_port}`;
    },
    title: <Trans>Port</Trans>,
  },
  {
    field(row: Connection) {
      return (
        <>
          <FormatBytes value={row.bytes_written} unit="kiB" removeUnit fixedDecimals />
          /
          <FormatBytes value={row.bytes_read} unit="kiB" removeUnit fixedDecimals />
        </>
      );
    },
    title: <Trans>KiB Up/Down</Trans>,
  },
  {
    title: <Trans>Actions</Trans>,
    field(row: Connection) {
      return (
        <FarmCloseConnection nodeId={row.node_id}>
          {({ onClose }) => (
            <StyledIconButton onClick={() => onClose()}>
              <DeleteIcon />
            </StyledIconButton>
          )}
        </FarmCloseConnection>
      );
    },
  },
];

export default function FarmFullNodeConnections() {
  const connections = useSelector((state: RootState) =>
    state.farming_state.farmer.connections.filter(
      (connection) => connection.type === 1,
    ),
  );

  const connected = useSelector(
    (state: RootState) => state.daemon_state.farmer_connected,
  );

  return (
    <Card 
      title={(
        <Trans>
          Your Full Node Connection
        </Trans>
      )}
      tooltip={(
        <Trans>
          {'The full node that your farmer is connected to is below. '}
          <Link target="_blank" href="https://github.com/lotus-Network/lotus-blockchain/wiki/Network-Architecture">
            Learn more
          </Link>
        </Trans>
      )}
      interactive
    >
      <Flex justifyContent="flex-end" gap={1}>
        <Typography variant="caption" color="textSecondary">
          <Trans>
            Connection Status:
          </Trans>
        </Typography>
        <FormatConnectionStatus connected={connected} />
      </Flex>
      <Table cols={cols} rows={connections} />
    </Card>
  );
}
