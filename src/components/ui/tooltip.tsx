import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import styles from "@/styles/tooltip.module.css";

function Tooltip({
	children,
	content,
	...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>) {
	return (
		<TooltipPrimitive.Root>
			<TooltipPrimitive.Trigger asChild>
				{children}
			</TooltipPrimitive.Trigger>
			<TooltipPrimitive.Content {...props} className={styles.TooltipContent}>
				{content}
				<TooltipPrimitive.Arrow width={11} height={5} className={styles.TooltipArrow}/>
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Root>
	);
}

export default Tooltip;