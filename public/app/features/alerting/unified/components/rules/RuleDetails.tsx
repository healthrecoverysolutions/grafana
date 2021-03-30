import { Rule, RulesSource } from 'app/types/unified-alerting';
import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { css, cx } from 'emotion';
import { GrafanaTheme } from '@grafana/data';
import { RuleQuery } from '../RuleQuery';
import { isAlertingRule } from '../../utils/rules';
import { isCloudRulesSource } from '../../utils/datasource';
import { Annotation } from '../Annotation';
import { AlertLabels } from '../AlertLabels';
import { AlertInstancesTable } from './AlertInstancesTable';
import { DetailsField } from './DetailsField';

interface Props {
  rule: Rule;
  rulesSource: RulesSource;
}

export const RuleDetails: FC<Props> = ({ rule, rulesSource }) => {
  const styles = useStyles(getStyles);

  const annotations = Object.entries((isAlertingRule(rule) && rule.annotations) || {});

  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.leftSide}>
          {!!rule.labels && !!Object.keys(rule.labels).length && (
            <DetailsField label="Labels" horizontal={true}>
              <AlertLabels labels={rule.labels} />
            </DetailsField>
          )}
          <DetailsField label="Expression" className={cx({ [styles.exprRow]: !!annotations.length })} horizontal={true}>
            <RuleQuery rule={rule} rulesSource={rulesSource} />
          </DetailsField>
          {annotations.map(([key, value]) => (
            <DetailsField key={key} label={key} horizontal={true}>
              <Annotation annotationKey={key} value={value} />
            </DetailsField>
          ))}
        </div>
        <div className={styles.rightSide}>
          {isCloudRulesSource(rulesSource) && (
            <DetailsField label="Data source">
              <img className={styles.dataSourceIcon} src={rulesSource.meta.info.logos.small} /> {rulesSource.name}
            </DetailsField>
          )}
        </div>
      </div>
      {isAlertingRule(rule) && !!rule.alerts?.length && (
        <DetailsField label="Matching instances" horizontal={true}>
          <AlertInstancesTable instances={rule.alerts} />
        </DetailsField>
      )}
    </div>
  );
};

export const getStyles = (theme: GrafanaTheme) => ({
  wrapper: css`
    display: flex;
    flex-direction: row;
  `,
  leftSide: css`
    flex: 1;
  `,
  rightSide: css`
    padding-left: 90px;
    width: 300px;
  `,
  exprRow: css`
    margin-bottom: 46px;
  `,
  dataSourceIcon: css`
    width: ${theme.spacing.md};
    height: ${theme.spacing.md};
  `,
});
