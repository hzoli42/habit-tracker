import Link from "next/link";
import Image from "next/image";
import styles from '../styles/Session.module.css';

const StopwatchImage = () => (
    <Image
        src="/images/stopwatch.jpg"
        height={150}
        width={130}
        alt="Stopwatch"
    />
);

export default function Session() {
    return (
        <div>
            <main className={styles.container}>
                <StopwatchImage />
                <h1 className={styles.title}>Session tracker</h1>
                <h1 className={styles.title}> <Link href="/">Back to landing page</Link> </h1>
            </main>
        </div>
    )
}