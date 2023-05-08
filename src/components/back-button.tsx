import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/router'

export const BackButton = () => {
    const { back } = useRouter();
    return (
        <Button className="self-start dark:text-white" onClick={back} style={{ paddingLeft: 0 }} variant="link"><ChevronLeft /> Back</Button>
    )
}
