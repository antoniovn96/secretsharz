// VidyaVantage RIASEC Interest Bank v2.2
// Activity-focused wording and interest-specific response anchors.
// This bank is an unvalidated item pool until pilot/reliability/validity evidence exists.

export const RIASEC_RESPONSE_OPTIONS = Object.freeze([
  'Strongly dislike',
  'Dislike',
  'Unsure',
  'Like',
  'Strongly like',
]);

const activity = (id, key, question, facet) => ({
  id,
  domain: 'riasec',
  type: 'likert5',
  question,
  construct: `riasec_${key}`,
  riasecKey: key,
  facet,
  options: RIASEC_RESPONSE_OPTIONS,
  scaleMin: 1,
  scaleMax: 5,
  responseAnchor: 'interest',
});

export const RIASEC_ITEMS = Object.freeze([
  // Realistic — practical, technical and hands-on activities
  activity('riasec_1', 'R', 'Using hand tools to build or repair something.', 'tools'),
  activity('riasec_2', 'R', 'Assembling equipment or parts by following a practical guide.', 'assembly'),
  activity('riasec_3', 'R', 'Operating machines or technical equipment to complete a task.', 'equipment'),
  activity('riasec_4', 'R', 'Working outdoors on a project where you can see a physical result.', 'outdoors'),
  activity('riasec_5', 'R', 'Finding and fixing the cause of a practical problem with an object or system.', 'repair'),
  activity('riasec_6', 'R', 'Learning how a device works and then demonstrating it to someone else.', 'technical_demonstration'),

  // Investigative — analytical, scientific and evidence-focused activities
  activity('riasec_7', 'I', 'Investigating why something happens by asking questions and gathering evidence.', 'investigation'),
  activity('riasec_8', 'I', 'Analysing information to find patterns before reaching a conclusion.', 'analysis'),
  activity('riasec_9', 'I', 'Carrying out an experiment to test an explanation or prediction.', 'experimentation'),
  activity('riasec_10', 'I', 'Working with numbers or data to understand what they show.', 'data'),
  activity('riasec_11', 'I', 'Comparing different explanations for the same problem and testing which fits the evidence.', 'hypothesis_testing'),
  activity('riasec_12', 'I', 'Doing research to learn more about a question that interests you.', 'research'),

  // Artistic — creative, expressive and open-ended activities
  activity('riasec_13', 'A', 'Writing a story, script, poem or other original piece of writing.', 'writing'),
  activity('riasec_14', 'A', 'Creating a visual design, illustration, photograph or other original image.', 'visual_creation'),
  activity('riasec_15', 'A', 'Creating or performing music, drama, dance or another form of performance.', 'performance'),
  activity('riasec_16', 'A', 'Developing an original idea when there is no single correct answer.', 'originality'),
  activity('riasec_17', 'A', 'Experimenting with colours, layouts, sounds, styles or other creative choices.', 'creative_experimentation'),
  activity('riasec_18', 'A', 'Creating a presentation, video or digital project where the style matters as well as the message.', 'creative_media'),

  // Social — helping, teaching and interpersonal activities
  activity('riasec_19', 'S', 'Helping someone understand a topic they are finding difficult.', 'teaching'),
  activity('riasec_20', 'S', 'Listening to someone who wants to talk through a problem.', 'listening'),
  activity('riasec_21', 'S', 'Teaching, tutoring, mentoring or coaching another person.', 'mentoring'),
  activity('riasec_22', 'S', 'Taking part in a project designed to improve people’s lives or a community.', 'community_service'),
  activity('riasec_23', 'S', 'Working closely with other people to help complete a shared goal.', 'collaboration'),
  activity('riasec_24', 'S', 'Explaining information or services to people and helping them make use of them.', 'service'),

  // Enterprising — influence, leadership and enterprise activities
  activity('riasec_25', 'E', 'Leading a group project and deciding how the work should be organised.', 'leadership'),
  activity('riasec_26', 'E', 'Presenting an idea and trying to persuade others to support it.', 'persuasion'),
  activity('riasec_27', 'E', 'Negotiating with people to reach an agreement.', 'negotiation'),
  activity('riasec_28', 'E', 'Planning a small business, venture or project and thinking about how it could succeed.', 'enterprise'),
  activity('riasec_29', 'E', 'Organising an event, campaign or activity and getting other people involved.', 'initiative'),
  activity('riasec_30', 'E', 'Setting a goal, taking responsibility for it and motivating others to work towards it.', 'goal_direction'),

  // Conventional — organising, accuracy and structured information
  activity('riasec_31', 'C', 'Organising records, files or information so that they are easy to find.', 'records'),
  activity('riasec_32', 'C', 'Checking documents, lists or data carefully for errors.', 'accuracy'),
  activity('riasec_33', 'C', 'Creating or maintaining a schedule so that tasks are completed on time.', 'scheduling'),
  activity('riasec_34', 'C', 'Following a clear procedure or set of standards to complete a task correctly.', 'procedures'),
  activity('riasec_35', 'C', 'Entering, sorting or organising information in a spreadsheet or database.', 'information_management'),
  activity('riasec_36', 'C', 'Keeping track of quantities, costs, budgets or other numerical records.', 'numerical_records'),
]);

export const RIASEC_ITEM_COUNT = RIASEC_ITEMS.length;
export const RIASEC_ITEMS_PER_CODE = Object.freeze({ R: 6, I: 6, A: 6, S: 6, E: 6, C: 6 });
