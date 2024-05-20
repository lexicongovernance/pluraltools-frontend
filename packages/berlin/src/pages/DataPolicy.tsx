// Components
import { Body } from '../components/typography/Body.styled';
import { FlexColumn } from '../components/containers/FlexColumn.styled';
import { SafeArea } from '../layout/Layout.styled';
import { Subtitle } from '../components/typography/Subtitle.styled';
import { Title } from '../components/typography/Title.styled';

// Data
import dataPolicy from '../data/dataPolicy';

function DataPolicy() {
  return (
    <SafeArea>
      <FlexColumn $gap="1.5rem">
        <Title>{dataPolicy.title}</Title>
        {dataPolicy.content.map((section) => (
          <FlexColumn key={section.id}>
            <Subtitle>{section.subtitle}</Subtitle>
            {section.copy.map((copy) => {
              if (copy.type === 'LIST') {
                return (
                  <ul key={copy.id} style={{ paddingInlineStart: '2.5rem' }}>
                    {copy.items.map((item) => (
                      <li key={item.id}>
                        <Body>{item.text}</Body>
                      </li>
                    ))}
                  </ul>
                );
              } else return <Body key={copy.id}>{copy.text}</Body>;
            })}
          </FlexColumn>
        ))}
      </FlexColumn>
    </SafeArea>
  );
}

export default DataPolicy;
