
export const tryCatch = (controller: any) => async(req: any, res: any, next: any) => {
    try {
        controller(req, res)
    } catch (err) {
        next(err)
    }
}