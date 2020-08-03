import Head from 'next/head'
import styles from '../styles/home.module.css'
import Layout from '../components/layout'
import Button from '../components/button'

export default function Home() {
  return (
    <Layout>
      <div className={styles.content}>
        <Button text="Create a new Quiz"/>
      </div>
      <div className={styles.content}>
        <Button text="Join a Quiz"/>
      </div>
    </Layout>
  )
}
