import { List, Empty, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCreateTopicMutation, useGetTopicsQuery } from '../api';

const LatestTopics = () => {
    const { t } = useTranslation(['topic']);

    // get latest topics
    const { data, loading } = useGetTopicsQuery({
        variables: {
            pagination: { offset: 0, limit: 5 },
        },
        nextFetchPolicy: 'cache-and-network',
    });

    const noTopics = !data?.topics?.length;

    const [createTopic] = useCreateTopicMutation({ variables: { title: 'Dummy', body: 'Dummy' } });

    if (!loading && noTopics) {
        return (
            <Empty description={t('topic:noTopicYet')}>
                <Button onClick={() => createTopic()} type="primary">
                    {t('topic:createFirstTopic')}
                </Button>
            </Empty>
        );
    }

    if (noTopics) {
        return null;
    }

    return (
        <List
            dataSource={data.topics}
            renderItem={topic => (
                <List.Item>
                    <List.Item.Meta
                        description={t('topic:previewDescription', {
                            author: topic.author.displayName,
                            replies: topic.messagesCount,
                        })}
                        title={<a href="https://ant.design">{topic.title}</a>}
                    />
                </List.Item>
            )}
        />
    );
};

export default LatestTopics;
