import { SessionLinks } from './SessionLinks';

type Props = { notFound: boolean };

export function PageIndex({ notFound }: Props) {
  return (
    <article>
      <h1>{notFound ? 'ページが見つかりません' : 'React原理 勉強会'}</h1>
      <p>
        {notFound
          ? 'URLの回のIDを確かめるか、下の一覧から選んでください。'
          : '社内の本・備品の貸出管理アプリを育てながら、Reactの原理を学びます。'}
      </p>
      <SessionLinks currentId={null} />
    </article>
  );
}
