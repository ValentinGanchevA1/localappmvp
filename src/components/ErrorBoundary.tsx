// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the app.
 */
class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
		errorInfo: null,
	};

	public static getDerivedStateFromError(error: Error): State {
		// Update state so the next render will show the fallback UI
		return {
			hasError: true,
			error,
			errorInfo: null,
		};
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// Log error to console in development
		if (__DEV__) {
			console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
		}

		// In production, you would send this to an error reporting service
		// Example: Sentry.captureException(error, { extra: errorInfo });

		// Only update errorInfo, don't update error again to avoid race conditions
		this.setState({
			errorInfo,
		});
	}

	private readonly handleReset = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		});
	};

	public render() {
		if (this.state.hasError) {
			// Use custom fallback if provided
			if (this.props.fallback) {
				return this.props.fallback;
			}

			// Default error UI
			return (
				<View style={styles.container}>
					<ScrollView
						contentContainerStyle={styles.scrollContent}
						showsVerticalScrollIndicator={false}
					>
						<Icon name="warning-outline" size={80} color={COLORS.DANGER} />

						<Text style={styles.title}>Oops! Something Went Wrong</Text>

						<Text style={styles.message}>
							An unexpected error occurred. Don't worry, your data is safe.
						</Text>

						{/* Show error details in development */}
						{__DEV__ && this.state.error && (
							<View style={styles.errorDetailsContainer}>
								<Text style={styles.errorDetailsTitle}>Error Details:</Text>
								<Text style={styles.errorMessage}>
									{this.state.error.toString()}
								</Text>
								{this.state.errorInfo && (
									<Text style={styles.errorStack}>
										{this.state.errorInfo.componentStack}
									</Text>
								)}
							</View>
						)}

						<View style={styles.buttonContainer}>
							<TouchableOpacity
								style={styles.primaryButton}
								onPress={this.handleReset}
								activeOpacity={0.7}
							>
								<Icon name="refresh" size={20} color={COLORS.WHITE} />
								<Text style={styles.primaryButtonText}>Try Again</Text>
							</TouchableOpacity>

						</View>

						<Text style={styles.supportText}>
							If this issue persists, please contact support.
						</Text>
					</ScrollView>
				</View>
			);
		}

		return this.props.children;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8f9fa',
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: SPACING.MD,
	},
	title: {
		fontSize: TYPOGRAPHY.SIZES.LG + 6,
		fontWeight: TYPOGRAPHY.WEIGHTS.BOLD as any,
		color: COLORS.DANGER,
		marginTop: SPACING.MD,
		marginBottom: SPACING.SM,
		textAlign: 'center',
	},
	message: {
		fontSize: TYPOGRAPHY.SIZES.MD,
		color: '#666',
		textAlign: 'center',
		marginBottom: SPACING.MD,
		lineHeight: 24,
		paddingHorizontal: SPACING.SM,
	},
	errorDetailsContainer: {
		backgroundColor: COLORS.WHITE,
		borderRadius: 8,
		padding: SPACING.MD,
		marginVertical: SPACING.MD,
		width: '100%',
		borderWidth: 1,
		borderColor: COLORS.DANGER,
	},
	errorDetailsTitle: {
		fontSize: TYPOGRAPHY.SIZES.SM,
		fontWeight: TYPOGRAPHY.WEIGHTS.BOLD as any,
		color: COLORS.DANGER,
		marginBottom: SPACING.SM,
	},
	errorMessage: {
		fontSize: 12,
		color: '#333',
		fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
		marginBottom: SPACING.SM,
	},
	errorStack: {
		fontSize: 11,
		color: '#666',
		fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
	},
	buttonContainer: {
		width: '100%',
		marginTop: SPACING.MD,
	},
	primaryButton: {
		flexDirection: 'row',
		backgroundColor: COLORS.PRIMARY,
		paddingVertical: SPACING.MD,
		paddingHorizontal: SPACING.LG,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: SPACING.SM,
	},
	primaryButtonText: {
		color: COLORS.WHITE,
		fontSize: TYPOGRAPHY.SIZES.MD,
		fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD as any,
		marginLeft: SPACING.SM,
	},
	supportText: {
		fontSize: TYPOGRAPHY.SIZES.SM,
		color: '#999',
		textAlign: 'center',
		marginTop: SPACING.LG,
	},
});

export default ErrorBoundary;
