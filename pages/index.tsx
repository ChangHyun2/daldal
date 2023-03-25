import { useAuthContext } from "@/store/context/AuthContext";

export default function Home() {
  const { user } = useAuthContext();

  return (
    <>
      <main>
        <h1>Home</h1>
        <p>{user ? `${user.username} 님 안녕하세요.` : `콘텐츠 준비 중...🛠`}</p>
      </main>
    </>
  );
}
