import { Avatar, Modal, TabsNav } from '@lobehub/ui';
import { Divider, Typography } from 'antd';
import { useTheme } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Center, Flexbox } from 'react-layout-kit';
import useMergeState from 'use-merge-value';

import MobilePadding from '@/components/MobilePadding';
import PluginSettingsConfig from '@/features/PluginSettings';
import { pluginHelpers, useToolStore } from '@/store/tool';
import { pluginSelectors } from '@/store/tool/selectors';

interface PluginDetailModalProps {
  id: string;
  onClose: () => void;
  onTabChange: (key: string) => void;
  open?: boolean;
  schema: any;
  tab: string;
}

const PluginDetailModal = memo<PluginDetailModalProps>(
  ({ schema, onClose, id, onTabChange, open, tab }) => {
    const pluginMeta = useToolStore(pluginSelectors.getPluginMetaById(id), isEqual);
    const [tabKey, setTabKey] = useMergeState('info', {
      onChange: onTabChange,
      value: tab,
    });
    const { t } = useTranslation('plugin');
    const theme = useTheme();

    return (
      <Modal
        cancelText={t('cancel', { ns: 'common' })}
        okText={t('ok', { ns: 'common' })}
        onCancel={onClose}
        onOk={() => {
          onClose();
        }}
        open={open}
        title={t('detailModal.title')}
        width={600}
      >
        <MobilePadding>
          <Center gap={16}>
            <Avatar
              avatar={pluginHelpers.getPluginAvatar(pluginMeta) || '⚙️'}
              background={theme.colorFillContent}
              gap={12}
              size={64}
            />

            <Flexbox style={{ fontSize: 20 }}>{pluginHelpers.getPluginTitle(pluginMeta)}</Flexbox>
            <Typography.Text type={'secondary'}>
              {pluginHelpers.getPluginDesc(pluginMeta)}
            </Typography.Text>
            <Divider style={{ marginBottom: 0, marginTop: 8 }} />
            <TabsNav
              activeKey={tabKey}
              items={[
                {
                  key: 'info',
                  label: t('detailModal.tabs.info'),
                },
                schema && {
                  key: 'settings',
                  label: t('detailModal.tabs.settings'),
                },
              ]}
              onChange={setTabKey}
            />
            {schema && <PluginSettingsConfig id={id} schema={schema} />}
          </Center>
        </MobilePadding>
      </Modal>
    );
  },
);

export default PluginDetailModal;
