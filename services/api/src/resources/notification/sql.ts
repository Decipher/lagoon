const { knex } = require('../../util/db');

export const Sql = {
  createProjectNotification: (input) => {
    const { pid, notificationType, nid } = input;

    return knex('project_notification')
      .insert({
        pid,
        type: notificationType,
        nid,
      })
      .toString();
  },
  selectProjectNotificationByNotificationName: (input) => {
    const { name, type } = input;

    return knex('project_notification AS pn')
      .joinRaw(
        `JOIN notification_${type} AS nt ON pn.nid = nt.id AND pn.type = ?`,
        [type],
      )
      .where('nt.name', '=', name)
      .select('nt.*', 'pn.*', knex.raw('? as type', [type]))
      .toString();
  },
  deleteProjectNotification: (input) => {
    const deleteQuery = knex.raw(
      `DELETE pn
      FROM project_notification as pn
      LEFT JOIN :notificationTable: AS nt ON pn.nid = nt.id AND pn.type = :notificationType
      LEFT JOIN project as p on pn.pid = p.id
      WHERE p.name = :project
      AND nt.name = :notificationName`,
      {
        ...input,
        notificationTable: `notification_${input.notificationType}`,
      },
    );

    return deleteQuery.toString();
  },
  selectProjectById: (input) =>
    knex('project')
      .select('*')
      .where({
        'project.id': input,
      })
      .toString(),
  selectProjectNotification: (input) => {
    const { project, notificationType, notificationName } = input;
    return knex({ p: 'project', nt: `notification_${notificationType}` })
      .where({ 'p.name': project })
      .andWhere({ 'nt.name': notificationName })
      .select({ pid: 'p.id', nid: 'nt.id' })
      .toString();
  },
  updateNotificationMicrosoftTeams: (input) => {
    const { name, patch } = input;

    return knex('notification_microsoftteams')
      .where('name', '=', name)
      .update(patch)
      .toString();
  },
  updateNotificationRocketChat: (input) => {
    const { name, patch } = input;

    return knex('notification_rocketchat')
      .where('name', '=', name)
      .update(patch)
      .toString();
  },
  updateNotificationEmail: (input) => {
    const { name, patch } = input;

    return knex('notification_email')
      .where('name', '=', name)
      .update(patch)
      .toString();
  },
  updateNotificationSlack: (input) => {
    const { name, patch } = input;

    return knex('notification_email')
      .where('name', '=', name)
      .update(patch)
      .toString();
  },
  selectNotificationsByTypeByProjectId: (input) => {
    const { type, pid } = input;
    const selectQuery = knex('project_notification AS pn').joinRaw(
      `JOIN notification_${type} AS nt ON pn.nid = nt.id AND pn.type = ?`,
      [type],
    );

    return selectQuery
      .where('pn.pid', '=', pid)
      .select('nt.*', 'pn.type')
      .toString();
  },
  selectNotificationMicrosoftTeamsByName:  (name: string) =>
    knex('notification_microsoftteams')
      .where('name', '=', name)
      .toString(),
  selectNotificationRocketChatByName: (name: string) =>
    knex('notification_rocketchat')
      .where('name', '=', name)
      .toString(),
  selectNotificationSlackByName: (name: string) =>
    knex('notification_slack')
      .where('name', '=', name)
      .toString(),
  selectNotificationEmailByName: (name: string) =>
    knex('notification_email')
      .where('name', '=', name)
      .toString(),
  truncateNotificationSlack: () =>
    knex('notification_slack')
      .truncate()
      .toString(),
  truncateNotificationEmail: () =>
    knex('notification_email')
      .truncate()
      .toString(),
  truncateNotificationRocketchat: () =>
    knex('notification_rocketchat')
      .truncate()
      .toString(),
  truncateNotificationMicrosoftTeams: () =>
    knex('notification_microsoftteams')
      .truncate()
      .toString(),
  truncateProjectNotification: () =>
    knex('project_notification')
      .truncate()
      .toString(),
};
